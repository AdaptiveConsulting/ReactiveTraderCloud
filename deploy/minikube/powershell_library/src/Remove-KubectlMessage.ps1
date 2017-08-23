function Remove-KubectlMessage {
    Write-Host -f "Cyan" -Object "Remove next Kubectl not installed message"

    Assert-IsAdministrator
    [Hashtable] $shared_data = Get-SharedData
    & $shared_data.minikube_exe config set WantKubectlDownloadMsg false
    Write-Host " "
}
