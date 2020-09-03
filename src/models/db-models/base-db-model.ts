import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Add basic columns to each database table
 * created - auto-generated column with the date of creation of the model
 * updated - auto-updated column with the last update date of the row
 */
export class BaseDatabaseModelModel {
    @CreateDateColumn({ type: 'timestamptz' })
    public created?: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    public updated?: Date;
}
