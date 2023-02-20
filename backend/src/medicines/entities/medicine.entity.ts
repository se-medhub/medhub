import { Pharmacy } from "src/pharmacies/entities/pharmacy.entity";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany, ManyToMany } from "typeorm";

@Entity()
@Unique([ "brandName" ])
export class Medicine {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    genericName: string;

    @Column()
    brandName: string;

    @Column()
    batchNumber: string;

    @Column()
    ammount: number;

    @Column()
    receivingAddress: string;

    @Column()
    storageConditions: string;

    @Column()
    expiryDate: string;

    @OneToMany(() => Reservation, reservation => reservation.medicine)
    reservations: Reservation[];

    @ManyToMany(() => Pharmacy, pharmacy => pharmacy.medicines, {
        eager: true
    })
    pharmacies: Pharmacy[];

    addPharmacy(pharmacy: Pharmacy) {
        if (!this.pharmacies) {
            this.pharmacies = new Array<Pharmacy>();
        }

        this.pharmacies.push(pharmacy);
    }
}