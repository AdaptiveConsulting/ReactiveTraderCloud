function Start-RtcMinikube {

    [Microsoft.HyperV.PowerShell.VirtualMachineBase] $minikube_vm = Get-MinikubeVm
    if ($minikube_vm.State -ne "Running") {
        Add-HyperVSwitch
        Get-MinikubeExeFile
        Remove-KubectlMessage
        Start-MinikubeVm
        New-EnvironmentVariables
    }
    else {
        Write-Host -f "Cyan" -Object "$($minikube_vm.Name) is already running"
    }
    
    Invoke-ShareHostDrive
}
