
function Get-MinikubeExeFile {

    [Hashtable] $shared_data = Get-SharedData
    $download_error_message = "unable to download minikube.exe, trying again in a few seconds"

    if (! (Test-Path $shared_data.minikube_exe)) {
        Write-Host -f "Cyan" -Object "Downloading minikube.exe"

        $minikube_url = "https://storage.googleapis.com/minikube/releases/latest/minikube-windows-amd64.exe"

        $web_client = New-Object System.Net.WebClient
        foreach ($i in 1..5) {
            try {
                $web_client.DownloadFile($minikube_url, $shared_data.minikube_exe)
                if ($?) {
                    Write-Host "minikube.exe downloaded`n"
                    return
                }
                else {
                    Write-Host $download_error_message
                }
            }
            catch {
                Write-Host $download_error_message
            }
            Start-Sleep -s 5
        }
        Throw "Failed to download minikube from $minikube_url"
    }
}
