function Stop-MinikubeVm {

    Write-Host -ForegroundColor "Cyan" -Object "Stop Minikube VM"
    
    [Microsoft.HyperV.PowerShell.VirtualMachineBase] $minikube_vm = Get-MinikubeVm

    if ($minikube_vm -and $minikube_vm.State -ne "off") {
        Write-Host -Object "$($minikube_vm.Name) is running. Stopping ..."
        
        Stop-VM $minikube_vm
        if ($?) {
            Write-Host -Object "$($minikube_vm.Name) stopped`n"
        } else {
            Throw "Error when stopping $($minikube_vm.Name)"
        }
    }
    else {
        Write-Host -Object "Minikube virtual machine is not running`n"
    }
}
