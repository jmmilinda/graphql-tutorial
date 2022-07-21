const { ApolloServer, gql } = require("apollo-server");
//const employees = require('./data/employee.json');
const EmployeeService = require("./datasources/file");
const ProjectService = require("./datasources/project");

const typeDefs = gql`

type Query {
  employees(
    id: Int,
    firstName: String,
    lastName: String,
    jobTitleName: String,
    emailAddress: String,
    region: String
  ) : [Employee],
  findEmployeeById(id: ID): Employee,
  projects: [Project],
  findProjectById(id: ID): Project
}

type Employee {
  id: ID!,
  firstName: String,
  lastName: String,
  jobTitleName: String @deprecated (reason: "Job title has been changed"),
  emailAddress: String,
  region: String,
  projects: [Project]
}

type Project {
  id: ID!,
  projectName: String,
  startDate: String,
  client: String
  employees: [Int]
}
`;

const resolvers = {
  Query: {
    employees: (parent, args, { dataSources }, info) => {
      return dataSources.employeeService.getEmployees(args);
    },
    findEmployeeById: (parent, { id }, { dataSources }, info) => {
      return dataSources.employeeService.getEmployeeById(id)[0];
    },
    projects: (parent, args, { dataSources }, info) => {
      return dataSources.projectService.getProjects();
    },
    findProjectById: (parent, { id }, { dataSources }, info) => {
      return dataSources.projectService.findProjectById(id);
    }
  },
  Employee: {
    async projects(employee, args, { dataSources }, info){
      let projects = await dataSources.projectService.getProjects();
      let workingProject = projects.filter(project => {
        return project.employees.includes(employee.id);
      });
      return workingProject;
    }
  }
};

const dataSources = () => ({
  employeeService: new EmployeeService(),
  projectService: new ProjectService()
});

const gqlServer = new ApolloServer({ typeDefs, resolvers, dataSources });

gqlServer
  .listen({ port: process.env.port || 4000 })
  .then(({ url }) => console.log(`Graphql server start ${url}`));
