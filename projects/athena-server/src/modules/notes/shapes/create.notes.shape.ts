import { IsString, IsOptional, Length } from 'class-validator';


export class CreateNoteShape {
    @IsString()
    @Length(1, 100)
    title!: string;

    @IsString()
    @IsOptional()
    body?: string;
}
