import { sdk } from '../sdk'
import { showMasterPassword } from './showMasterPassword'

export const actions = sdk.Actions.of().addAction(showMasterPassword)
