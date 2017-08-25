function Remove-RtcMinikube {
    Stop-MinikubeVm
    Remove-MinikubeVm
    Remove-MinikubeDataFiles
    Remove-MinikubeSwitch
}
