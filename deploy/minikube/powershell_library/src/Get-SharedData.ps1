function Get-SharedData {

    [String] $minikube_data_directory = "$PSScriptRoot\..\..\minikube_data"

    if (-Not (Test-Path $minikube_data_directory)) {
        New-Item -ItemType Directory -Path $minikube_data_directory |
            Out-Null
        if (!$?) {
            Throw "Error when creating minikube_data directory"
        }
    }

    @{
        minikube_data_directory = $minikube_data_directory
        vmswitch_name = "MiniKubeNAT"
        vm_name = "minikube"

        minikube_exe = "$minikube_data_directory\minikube.exe"
        minikube_ip_file = "$minikube_data_directory\minikube_ip"

        certificate = "$minikube_data_directory\apiserver.crt"
        certificate_key = "$minikube_data_directory\apiserver.key"
        certificate_authority = "$minikube_data_directory\ca.crt"

        docker_env_bash = "$minikube_data_directory\docker-env.sh"
        docker_env_powershell = "$minikube_data_directory\docker-env.ps1"

        memory_configuration = "$minikube_data_directory\memory_configuration"
    }
}
