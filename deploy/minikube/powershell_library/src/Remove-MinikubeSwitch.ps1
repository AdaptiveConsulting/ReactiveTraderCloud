function Remove-MinikubeSwitch {
    
    Write-Host -ForegroundColor "Cyan" -Object "Removing Minikube Switch"
    
    [Microsoft.HyperV.PowerShell.VMSwitch] $minikube_vmswitch = Get-MinikubeSwitch
    if ($minikube_vmswitch) {
        Remove-VMSwitch $minikube_vmswitch -Force
        if ($?) {
            Write-Host "$($minikube_vmswitch.Name) removed`n"
        }
        else {
            Throw "Error when removing $($minikube_vmswitch.Name)"
        }
    }
    else {
        Write-Host "Minikube Switch was not present`n"
    }
}
