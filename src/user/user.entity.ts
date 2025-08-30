import { Report } from "../report/report.entity";
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @Column({ default: true })
  isAdmin: boolean

  // "() => Report" tells typorme what kind of record is associated with the User
  // avoid circular dependecy
  // "report.user" if there ir another relation with Report
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[]

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id: ', this.id)
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id: ', this.id)
  }

  @AfterRemove()
  logRemove() {
    console.log('Remove user with id: ', this.id)
  }
}