import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const tempDir = os.tmpdir();
const tempDosFile = path.join(tempDir, `openfin-dos-${Date.now()}.json`);

const DOS = {
	desktopSettings: {
		securedAPIDefaultPermission: 'allow',
		systemApps: {
			workspace: {
				version: '13.1.8'
			}
		}
	}
};

fs.writeFileSync(tempDosFile, JSON.stringify(DOS));

spawnSync(
	`Echo Y|reg add "HKCU\\Software\\OpenFin\\RVM\\Settings" -v "DesktopOwnerSettings" -d "file:\\\\\\${tempDosFile}"`,
	{ shell: true }
);
