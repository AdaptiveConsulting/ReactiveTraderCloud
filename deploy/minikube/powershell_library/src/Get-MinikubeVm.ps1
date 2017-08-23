function Get-MinikubeVm {
    Assert-IsAdministrator
    [Hashtable] $shared_data = Get-SharedData
    Get-VM |
        Where-Object { $_.Name -eq $shared_data.vm_name }
}
