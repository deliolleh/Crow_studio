import api from "./api";

const teamApi = {
  getTeams: () => api.get("/teams"),
  getTeam: (teamSeq) => api.get(`/teams/${teamSeq}`),
  createTeam: (teamName) => api.post("/teams/create", teamName),
  modifyTeamName: (teamSeq, teamName) =>
    api.put(`/teams/modify/name/${teamSeq}`, teamName),
  deleteTeam: (teamSeq) => api.delete(`/teams/delete/${teamSeq}`),
  getMembers: (teamSeq) => api.get(`/teams/member/${teamSeq}`),
  addMember: (addData) => api.put("/teams/add", addData),
  deleteMember: (deleteData) => api.delete("/teams/remove", deleteData),
  delegateLeader: (delegateData) => api.put("teams/beLeader", delegateData),
  resignTeam: (teamSeq) => api.delete(`teams/quit/${teamSeq}`),
};

export default teamApi;
