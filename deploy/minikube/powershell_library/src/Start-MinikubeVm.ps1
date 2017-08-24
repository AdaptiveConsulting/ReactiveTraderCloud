function Start-MinikubeVm {
    Write-Host -f "Cyan" "Starting minikube:"
    
    Assert-IsAdministrator
    [Hashtable] $shared_data = Get-SharedData

    [Int] $memory = Get-MinikubeMemory

    # https://github.com/docker/machine/issues/2318
    & $shared_data.minikube_exe start `
        --vm-driver="hyperv" `
        --hyperv-virtual-switch="$($shared_data.vmswitch_name)" `
        --memory $memory
    if ($?) {
        Write-Host "minikube started`n"
    } else {
        Throw "Unable to start minikube"
    }
}
