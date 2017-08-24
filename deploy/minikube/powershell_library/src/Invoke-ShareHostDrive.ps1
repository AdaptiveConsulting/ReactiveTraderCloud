function Invoke-ShareHostDrive {

    [Hashtable] $shared_data = Get-SharedData
    
    Write-Host -f "Cyan" "Share host C drive with VM"
    [String] $root_directory = (get-item $PSScriptRoot).parent.parent.parent.parent.FullName
    [String] $root_directory_linux = $root_directory -replace "C:\\","/c/" -replace "\\","/"

    # https://github.com/kubernetes/minikube/issues/1473
    & $shared_data.minikube_exe mount "${root_directory}:${root_directory_linux}"
}
