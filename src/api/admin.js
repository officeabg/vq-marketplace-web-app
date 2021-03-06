import * as communication from '../core/communication'

export const users = {
    getItems: () => communication.doGet('/admin/user'),
    blockUser: userId => communication.doPut(`/admin/user/${userId}/block`, {}),
    unblockUser: userId => communication.doPut(`/admin/user/${userId}/unblock`, {}),
};

export const report = {
    overview: () => communication.doGet('/admin/report')
};
