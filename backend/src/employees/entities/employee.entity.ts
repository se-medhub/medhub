import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from "bcrypt";

import { Pharmacy } from "src/pharmacies/entities/pharmacy.entity";

@Entity()
@Unique(['username'])
export class Employee extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    async checkPassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }


    @ManyToOne(() => Pharmacy, pharmacy => pharmacy.employees, {
        cascade: true
    })
    pharmacy: Pharmacy;

    checkPharmacy(pharmacy: Pharmacy): boolean {
        if (pharmacy && Array.isArray(pharmacy.employees)) {
            for (let i = 0; i < pharmacy.employees.length; i++) {
                if ( pharmacy.employees[i].id === this.id ) {
                    return true;
                }
            }
        }

        return false;
    }

    @Column()
    role: string;
}