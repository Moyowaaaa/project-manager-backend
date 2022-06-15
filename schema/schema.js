const {clients, projects} = require("../sampleData")


//mongoose Models
const Client = require("../models/client");
const Project = require("../models/project");


const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLEnumType
} = require("graphql");


//project

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    clientId: { type: GraphQLID },
    name:{type: GraphQLString},
    description:{type: GraphQLString},

    client: {
      type: ClientType,
      resolve(parent,args) {
        return Client.findById(parent.clientId)

        // return clients.find((client)=> client.id === parent.clientId)
      }
    }
  })
})


//client

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      phone: { type: GraphQLString },
    }),
  });



  const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
      //clients

      clients:{
        type: new GraphQLList(ClientType),
        resolve(parent,args){
          return Client.find()
        
          // return clients

        }
      },

      //single client
        client:{
            type:ClientType,
            args: { id: {type:GraphQLID} },
            resolve(parent, args){
                return Client.findById(args.id)

                // return clients.find((client)=> client.id === args.id)
             }
        },

        //projects
        projects:{
          type: new GraphQLList(ProjectType),
          resolve(parent,args){
           return Project.find();

          //  return projects
          }
        },

        //single project
          project:{
              type:ProjectType,
              args: { id: {type:GraphQLID}, },
              resolve(parent, args){
                  return Project.findById(args.id)

                  // return projects.find((project)=> project.id === args.id)
               }
          },
  

    }
  });


  //Mutations
 const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{

      //add client
      addClient:{
        type: ClientType,
        args:{
          name: {type: new GraphQLNonNull(GraphQLString)},
          email: {type: new GraphQLNonNull(GraphQLString)},
          phone: {type: new GraphQLNonNull(GraphQLString)},
        },
        resolve(parent, args){
          const client = new Client({
            name: args.name,
            email: args.email,
            phone: args.phone,
          });

          return client.save();
        }
      },

      //delete client
      deleteClient:{
        type: ClientType,
        args:{
          id: {type: new GraphQLNonNull(GraphQLID)},
        },
        resolve(parent, args) {
          return Client.findByIdAndRemove(args.id)
        }
      },



      //add project
      addProject:{
        type: ProjectType,
        args:{
          name: {type: new GraphQLNonNull(GraphQLString)},
          description: {type: new GraphQLNonNull(GraphQLString)},
          clientId: {type: new GraphQLNonNull(GraphQLID)},
          status:{
            type: new GraphQLEnumType({
              name:'ProjectStatus',
              values:{
                'new':{value: 'Not Started'},
                'progress':{value: 'In Progress'},
                'completed':{value: 'Completed'},
                
              }

            }),
            defaultValue: 'Not Started'
          },
          clientId: {type: new GraphQLNonNull(GraphQLID)}
        },
        resolve(parent, args){
          const project = new Project({
            name:args.name,
            description:args.description,
            clientId:args.clientId,
            status:args.status,
          });

          return project.save();
        }
      },

      //delete project
      deleteProject:{
        type: ProjectType,
        args:{
          id: {type:new GraphQLNonNull(GraphQLID)}
        },
        resolve(parent,args) {
          return Project.findByIdAndRemove(args.id)
        }
      },
      

      //updateProject

      updateProject: {
        type: ProjectType,
        args:{
          id: {type:new GraphQLNonNull(GraphQLID)},
          name: {type: GraphQLString},
          description: {type: GraphQLString},
          status:{
            type: new GraphQLEnumType({
              name:'ProjectStatusUpdate',
              values:{
                'new':{value: 'Not Started'},
                'progress':{value: 'In Progress'},
                'completed':{value: 'Completed'},
                
              }

            }),
          },

        },
        resolve(parent,args){
          return Project.findByIdAndUpdate(
            args.id,
            {
              $set: {
                name: args.name,
                description: args.description,
                status: args.status,
              }
            },
            {new: true}
          );
      }
    }

    



    }
 })






module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
  
});
