import wdyrStore from './wdyrStore';

export function getCurrentOwner() {
  const reactSharedInternals = wdyrStore.React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  const reactDispatcher = reactSharedInternals?.A;
  return reactDispatcher?.getOwner();
}
