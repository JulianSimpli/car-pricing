import { User } from "../user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: false })
  approved: boolean

  @Column()
  price: number

  @Column()
  make: string

  @Column()
  model: string

  @Column()
  year: number

  @Column()
  lng: number

  @Column()
  lat: number

  @Column()
  mileage: number

  // "() => User" tells typorme what kind of record is associated with the Report
  // avoid circular dependecy
  // "user.reports" if there ir another relation with User 
  @ManyToOne(() => User, (user) => user.reports)
  user: User
}