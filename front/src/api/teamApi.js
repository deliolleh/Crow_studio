import api from "./api";

const teamApi = {
  getTeams: () => api.get("/teams"),
  getTeam: (teamSeq) => api.get(`/teams/${teamSeq}`),
  createTeam: (teamName) => api.post("/teams/create", teamName),
  modifyTeamName: (teamSeq, teamName) =>
    api.put(`/teams/modify/${teamSeq}`, teamName),
  deleteTeam: (teamSeq) => api.delete(`/team/delete/${teamSeq}`),
  getMembers: (teamSeq) => api.get(`/team/member/${teamSeq}`),
  addMember: (addData) => api.put("/team/add", addData),
  deleteMember: (deleteData) => api.delete("/team/remove", deleteData),
  delegateLeader: (delegateData) => api.put("/beLeader", delegateData),
  resignTeam: (teamSeq) => api.delete(`/quit/${teamSeq}`),
};

export default teamApi;
