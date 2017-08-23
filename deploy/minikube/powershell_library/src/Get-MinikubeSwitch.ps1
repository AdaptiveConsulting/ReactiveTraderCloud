function Get-MinikubeSwitch {
    [Hashtable] $shared_data = Get-SharedData
    Get-VMSwitch |
    Where-Object { $_.Name -eq $shared_data.vmswitch_name }
}
