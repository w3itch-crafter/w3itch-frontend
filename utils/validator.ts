import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator'
// @TODO Property 'message' does not exist on type 'FieldError[]'
// import { NestedValue } from 'react-hook-form'
import { Community, Genre, PaymentMode } from 'types/enum'

export class Game {
  @Length(1, 50)
  @IsString()
  @IsNotEmpty()
  title: string

  @Length(1, 120)
  @IsString()
  subtitle: string

  @Length(1, 50)
  @IsString()
  // doesn't allow starts or ends with _ or -
  @Matches(/^[^-_].*[^-_]$/)
  gameName: string

  // @IsEnum(ProjectClassification)
  // @IsNotEmpty()
  // classification: ProjectClassification

  // @IsEnum(GameEngine)
  // @IsNotEmpty()
  // kind: GameEngine

  // @IsEnum(ReleaseStatus)
  // releaseStatus: ReleaseStatus

  @IsEnum(PaymentMode)
  @IsNotEmpty()
  paymentMode: PaymentMode

  // @IsString()
  // @IsNotEmpty()
  // description: string

  @IsEnum(Community)
  @IsNotEmpty()
  community: Community

  @IsEnum(Genre)
  @IsNotEmpty()
  genre: Genre

  @Length(2, 60, { each: true })
  // eslint-disable-next-line no-useless-escape
  @Matches(/^[a-zA-Z0-9 \-]+$/, { each: true })
  @IsString({ each: true })
  @IsOptional()
  tags: string[]

  @Length(1, 120, { each: true })
  @IsUrl({ require_protocol: true }, { each: true })
  appStoreLinks: string[]

  @IsInt()
  tokenId: number

  @IsUrl({ require_protocol: true })
  @IsNotEmpty()
  cover: string

  @IsUrl({ require_protocol: true }, { each: true })
  @IsOptional()
  screenshots: string[]
}
