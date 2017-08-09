# Import config
$config = "$PSScriptRoot\minikube_config.ps1"
if (!(Test-Path $config)) {
    Throw "$config was not found"
}
. $config

# Test if VM is Running
$vm = Get-VM |
    Where-Object { $_.Name -eq $config_minikube_vm_name }
if ($vm) {
    if ($vm.State -ne "off") {
        Write-Host -f "Cyan" -Object "$config_minikube_vm_name is already running"
        & "$PSScriptRoot\Share-HostDrive.ps1"
        return
    }
}

# Install minikube
if (! (Test-Path $config_minikube)) {
    Write-Host -f "Cyan" -Object "Downloading minikube.exe"
    $minikube_url = "https://storage.googleapis.com/minikube/releases/latest/minikube-windows-amd64.exe"
    $web_client = New-Object System.Net.WebClient
    $web_client.DownloadFile($minikube_url, $config_minikube)
    if ($?) {
        Write-Host "minikube.exe downloaded`n"
    } else {
        Throw "Unable to download minikube from $minikube_url"
    }
}

# Create Hyper-V switch
$ethernet_adapter_name = "Ethernet"
$ethernet_adapter = Get-NetAdapter -Name $ethernet_adapter_name
$external_vm_switchs = Get-VMSwitch |
    Where-Object {
        $_.SwitchType -eq "external" `
        -and $ethernet_adapter.InterfaceDescription -eq $_.NetAdapterInterfaceDescription
    }

if (!$external_vm_switchs) {
    Write-Host -f "Cyan" -Object "Adding external VMSwitch"
    $external_vm_switchs = New-VMSwitch `
        -Name $config_minikube_vmswitch_name `
        -NetAdapterName $ethernet_adapter_name `
        -AllowManagementOS $true `
        -Notes "VMSwitch for Minikube with ReactiveTrader"
    if ($?) {
        Write-Host -Object "VMSwitch created`n"
    }
    else {
        Throw "Unable to create external VMSwitch for minikube"
    }
}

# Remove kubectl message
& $config_minikube config set WantKubectlDownloadMsg false

# start
Write-Host -f "Cyan" "Starting minikube:"
& $config_minikube start `
    --vm-driver="hyperv" `
    --hyperv-virtual-switch="$($external_vm_switchs.Name)" `
    --memory 6144
if ($?) {
    Write-Host "minikube started`n"
} else {
    Throw "Unable to start minikube"
}

# Set ENV variables
Write-Host -f "Cyan" "Put environment variables into files"
$Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False

[String] $ip = & $config_minikube ip
[System.IO.File]::WriteAllLines("$PSScriptRoot\minikube_ip", $ip, $Utf8NoBomEncoding)

[String] $bash_docker_env_file = "$PSScriptRoot\docker-env.sh"
[String] $bash_docker_env = & $config_minikube docker-env --shell bash
[System.IO.File]::WriteAllLines($bash_docker_env_file, $bash_docker_env, $Utf8NoBomEncoding)
"export DOCKER_TLS_VERIFY=1`n" | Out-File $bash_docker_env_file -Append

[String] $powershell_docker_env_file = "$PSScriptRoot\docker-env.ps1"
[String] $powershell_docker_env = & $config_minikube docker-env --shell powershell
[System.IO.File]::WriteAllLines($powershell_docker_env_file, $powershell_docker_env, $Utf8NoBomEncoding)
"`$env:DOCKER_TLS_VERIFY=1`n" | Out-File $powershell_docker_env_file -Append

Copy-Item "$HOME\.minikube\apiserver.crt" "$PSScriptRoot\apiserver.crt"
Copy-Item "$HOME\.minikube\apiserver.key" "$PSScriptRoot\apiserver.key"
Copy-Item "$HOME\.minikube\ca.crt" "$PSScriptRoot\ca.crt"

Write-Host -Object "You can run these commands to use the docker running in the minikube VM:"
Write-Host -Object " -for BASH: . $PSScriptRoot\docker-env.sh`n"
Write-Host -Object " -for POWERSHELL: . $PSScriptRoot\docker-env.sh`n"
Write-Host -Object " "

# Share drive
& "$PSScriptRoot\Share-HostDrive.ps1"
