import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator'
import {
  Community,
  GameEngine,
  Genre,
  PaymentMode,
  ProjectClassification,
  ReleaseStatus,
} from 'types/enum'

export class Game {
  @Length(1, 50)
  @IsString()
  @IsNotEmpty()
  title: string

  @Length(1, 120)
  @IsString()
  subtitle: string

  @IsEnum(ProjectClassification)
  @IsNotEmpty()
  classification: ProjectClassification

  @IsEnum(GameEngine)
  @IsNotEmpty()
  kind: GameEngine

  @IsEnum(ReleaseStatus)
  releaseStatus: ReleaseStatus

  @IsEnum(PaymentMode)
  @IsNotEmpty()
  paymentMode: PaymentMode

  // @IsString()
  // @IsNotEmpty()
  // description: string;

  @IsEnum(Community)
  @IsNotEmpty()
  community: Community

  @IsEnum(Genre)
  @IsNotEmpty()
  genre: Genre

  // tags: string[]

  // @Length(1, 120)
  // @IsString({ each: true })
  // appStoreLinks: string[]

  @Length(1, 120)
  appStoreLink: string
}
