function Add-HyperVSwitch {

    Assert-IsAdministrator
    
    [Hashtable] $shared_data = Get-SharedData

    [Microsoft.HyperV.PowerShell.VirtualizationObject[]] $external_vm_switchs =
        Get-VMSwitch |
        Where-Object {
            $_.SwitchType -eq "external"
        }

    if (!$external_vm_switchs) {
        Write-Host -f "Cyan" -Object "Adding external VMSwitch"
        
        [CimInstance[]] $external_and_up_adapters =
            Get-NetAdapter |
            Where-Object { !$_.Virtual -and $_.Status -eq "Up" }
            
        New-VMSwitch `
                -Name $shared_data.vmswitch_name `
                -AllowManagementOS $true `
                -NetAdapterName $external_and_up_adapters[0].Name `
                -Notes "VMSwitch for Minikube with ReactiveTrader" |
            Out-Null
        if ($?) {
            Write-Host -Object "VMSwitch created`n"
        }
        else {
            Throw "Unable to create external VMSwitch for minikube"
        }
    }
}
