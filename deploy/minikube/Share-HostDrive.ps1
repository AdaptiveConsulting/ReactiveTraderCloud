# Import config
$config = "$PSScriptRoot\minikube_config.ps1"
if (!(Test-Path $config)) {
    Throw "$config was not found"
}
. $config

# Share
Write-Host -f "Cyan" "Share host C drive with VM"
$root_directory = (get-item $PSScriptRoot).parent.parent.FullName
$root_directory
$root_directory_linux = $root_directory -replace "C:\\","/c/" -replace "\\","/"
$root_directory_linux
& $config_minikube mount --v 10 "${root_directory}:${root_directory_linux}"
