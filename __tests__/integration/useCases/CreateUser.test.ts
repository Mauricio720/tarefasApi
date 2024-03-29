import { FindByIdUserRepository } from './../../../application/repository/UserRepository';
import { CreateUserRepository, UserRepository } from "application/repository/UserRepository";
import { CreateUser } from "application/useCases/CreateUser";
import { UserRepositoryMemory } from "infra/repository/memory/UserRepositoryMemory";

describe("Create User", () => {
  let userRepository:CreateUserRepository & FindByIdUserRepository;

  beforeEach(() => {
    userRepository = new UserRepositoryMemory()
  })
  
  test("should create user", async () => {
    const inputCreateUser={
      name: 'any name',
      thumbnail:'any',
      email: 'any@any.com',
      password:'1234'
    }
    const createUser=new CreateUser(userRepository)
    const id=await createUser.execute(inputCreateUser)
    
    const user = await userRepository.findById(id)
    expect(user.getId()).toBe(id)
  })
})