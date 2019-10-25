import { message, danger } from "danger"

const modifiedFiles = danger.git.modified_files.map(file => `* ${file}`).join(' \n')
message(`THIS IS A TEST POST FROM DANGER\nChanged Files in this PR: \n` + modifiedFiles)
