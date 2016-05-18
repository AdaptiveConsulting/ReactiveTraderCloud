import BrowserPopoutService from './browserPopoutService';
import OpenfinPopoutService from './openfinPopoutService';

export default function getPopoutService(openfin) {
    return openfin.isRunningInOpenFin ? new OpenfinPopoutService(openfin) : new BrowserPopoutService();
}
