const employees = require('../data/employee.json');
const {DataSource} = require('apollo-datasource');
const _ = require('lodash');

class EmployeeService extends DataSource {

  constructor() {
    super();
  }

  initialize(config){

  }

  getEmployees(args){
    return _.filter(employees, args);
  }

  getEmployeeById(id){
    return employees.filter(function(employee){
      if(employee.id == id){
        return employee;
      }
    });
  }
}
 module.exports = EmployeeService;