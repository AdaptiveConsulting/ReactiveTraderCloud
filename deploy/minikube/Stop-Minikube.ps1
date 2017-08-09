# Import config
$config = "$PSScriptRoot\minikube_config.ps1"
if (!(Test-Path $config)) {
    Throw "$config was not found"
}
. $config

# Stop VM if Running
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
}
