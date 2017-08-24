function New-EnvironmentVariables {

    Assert-IsAdministrator
    
    [Hashtable] $shared_data = Get-SharedData

    Write-Host -f "Cyan" "Put environment variables into files"
    [System.Text.Encoding] $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
    
    # MINIKUBE IP
    [String] $ip = & $shared_data.minikube_exe ip
    [System.IO.File]::WriteAllLines($shared_data.minikube_ip_file, $ip, $Utf8NoBomEncoding)
    
    # BASH ENVIRONMENT VARIABLES
    [String] $bash_docker_env = & $shared_data.minikube_exe docker-env --shell bash
    [System.IO.File]::WriteAllLines($shared_data.docker_env_bash, $bash_docker_env, $Utf8NoBomEncoding)
    "export DOCKER_TLS_VERIFY=1`n" | Out-File $shared_data.docker_env_bash -Append
    
    # POWERSHELL ENVIRONMENT VARIABLES
    [String] $powershell_docker_env = & $shared_data.minikube_exe docker-env --shell powershell
    [System.IO.File]::WriteAllLines($shared_data.docker_env_powershell, $powershell_docker_env, $Utf8NoBomEncoding)
    "`$env:DOCKER_TLS_VERIFY=1`n" | Out-File $shared_data.docker_env_powershell -Append

    # CERTIFICATES
    Copy-Item "$HOME\.minikube\apiserver.crt" $shared_data.certificate
    Copy-Item "$HOME\.minikube\apiserver.key" $shared_data.certificate_key
    Copy-Item "$HOME\.minikube\ca.crt" $shared_data.certificate_authority
    
    Write-Host -Object "You can run these commands to use the docker running in the minikube VM:"
    Write-Host -Object " -for BASH: . $($shared_data.docker_env_bash)`n"
    Write-Host -Object " -for POWERSHELL: . $($shared_data.docker_env_powershell)`n"
    Write-Host -Object " "
}
