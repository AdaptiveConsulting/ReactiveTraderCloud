function Remove-MinikubeDataFiles {

    [Hashtable] $shared_data = Get-SharedData

    if (Test-Path "$HOME\.minikube") {
        Remove-Item -Recurse "$HOME\.minikube"
    }

    Write-Host -ForegroundColor "Cyan" "Remove local files"
    $shared_data.certificate,
    $shared_data.certificate_key,
    $shared_data.certificate_authority,
    $shared_data.minikube_ip_file,
    $shared_data.docker_env_bash,
    $shared_data.docker_env_powershell,
    $shared_data.minikube_exe |
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

    Write-Host "Minikube data files deleted`n"
}
