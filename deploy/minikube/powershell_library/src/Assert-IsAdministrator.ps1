function Assert-IsAdministrator {
    [Security.Principal.WindowsBuiltInRole] $administrator_role = "Administrator"

    $is_administrator = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole($administrator_role)

    if (-Not $is_administrator) {
        Throw "RTC Minikube script requires to be running on an elevated powershell console"
    }
}
