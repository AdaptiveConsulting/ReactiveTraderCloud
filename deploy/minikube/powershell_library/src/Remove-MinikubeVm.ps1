function Remove-MinikubeVm {

    [Microsoft.HyperV.PowerShell.VirtualMachineBase] $minikube_vm = Get-MinikubeVm

    if ($minikube_vm) {
        Write-Host -ForegroundColor "Cyan" "Removing $($minikube_vm.Name)"
        Remove-VM $minikube_vm -Force
        if ($?) {
            Write-Host "$($minikube_vm.Name) removed`n"
        } else {
            Throw "Error when removing $($minikube_vm.Name)"
        }
    }
}
