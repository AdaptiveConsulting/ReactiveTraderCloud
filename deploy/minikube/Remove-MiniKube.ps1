param(
    [Switch] $all,
    [Switch] $run
)

if (!$run) {
    "- This script remove minikube VM when you add parameter -run"
    "- You can add -all to also remove the exe file"
    return
}

# Import config
$config = "$PSScriptRoot\minikube_config.ps1"
if (!(Test-Path $config)) {
    Throw "$config was not found"
}
. $config

# VM
$vm = Get-VM |
    Where-Object { $_.Name -eq $config_minikube_vm_name }
if ($vm) {
    # Stop
    if ($vm.State -ne "off") {
        Write-Host -ForegroundColor "Cyan" -Object "$config_minikube_vm_name is running. Stopping ..."
        Stop-VM $vm
        if ($?) {
            Write-Host -Object "$config_minikube_vm_name stopped`n"
        } else {
            Throw "Error when stopping $config_minikube_vm_name"
        }
    }

    # Remove
    Write-Host -ForegroundColor "Cyan" "Removing $config_minikube_vm_name"
    Remove-VM $vm -Force
    if ($?) {
        Write-Host "$config_minikube_vm_name removed`n"
    } else {
        Throw "Error when removing $config_minikube_vm_name"
    }
}

if (Test-Path "$HOME\.minikube") {
    Remove-Item -Recurse "$HOME\.minikube"
}

Write-Host -ForegroundColor "Cyan" "Remove local files"
"$PSScriptRoot\apiserver.crt",
"$PSScriptRoot\apiserver.key",
"$PSScriptRoot\ca.crt",
"$PSScriptRoot\docker-env.sh",
"$PSScriptRoot\docker-env.ps1" |
    ForEach-Object {
        if (Test-Path -Path $_) {
            Remove-Item -Path $_
            if ($?) {
                Write-Host "$_ removed"
            } else {
                Throw "Error when removing $_"
            }
        }
    }
" "

if (!$all) {
    return
}

# VMSwitch
$minikube_vmswitch = Get-VMSwitch |
    Where-Object { $_.Name -eq $config_minikube_vmswitch_name }
if ($minikube_vmswitch) {
    Write-Host -ForegroundColor "Cyan" -Object "Removing $config_minikube_vmswitch_name"
    Remove-VMSwitch $minikube_vmswitch -Force
    if ($?) {
        Write-Host "$config_minikube_vmswitch_name removed`n"
    } else {
        Throw "Error when removing $config_minikube_vmswitch_name"
    }
}

# Minikube.exe
$minikube = "$PSScriptRoot\minikube.exe"
if (Test-Path -Path $minikube) {
    Write-Host -ForegroundColor "Cyan" -Object "Removing $minikube"
    Remove-Item -Path $minikube
    if ($?) {
        Write-Host "$minikube removed`n"
    } else {
        Throw "Error when removing $minikube"
    }
}
