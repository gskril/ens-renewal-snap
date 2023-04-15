import { OnCronjobHandler } from '@metamask/snaps-types';
import {
  getExpirationTimestamp,
  getOwnedEnsNames,
  getRelativeDay,
  notify,
} from './helpers';

export const onCronjob: OnCronjobHandler = async ({ request }) => {
  switch (request.method) {
    case 'ensExpiration': {
      const connectedAccount = await snap.request({
        method: 'snap_getBip32PublicKey',
        params: {
          path: ['m', "44'", "60'", "0'", "0'", '0'],
          curve: 'secp256k1',
        },
      });

      console.log(connectedAccount);

      const ownedEnsNames = await getOwnedEnsNames();

      for (const name of ownedEnsNames) {
        const expiration = await getExpirationTimestamp(name);
        const relativeExpiration = getRelativeDay(expiration);
        const message = `${name} expires in ${relativeExpiration}.`;
        return notify(message);
      }

      return null;
    }

    default:
      throw new Error('Method not found.');
  }
};

// TODO: use `wallet_invokeSnap` with `snap_manageState` to manage the names you want reminders for https://docs.metamask.io/snaps/reference/rpc-api#wallet_invokesnap
