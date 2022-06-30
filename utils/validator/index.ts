import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator'
import { Api } from 'types/Api'
import { Community, GameEngine, GameFileCharset, Genre, PaymentMode } from 'types/enum'

export class Game implements Omit<Api.GameProjectDto, 'classification' | 'prices' | 'releaseStatus'> {
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
  @Matches(/(^[^-_].*[^-_]$)|(^[^-_]$)/)
  gameName: string

  // @IsEnum(ProjectClassification)
  // @IsNotEmpty()
  // classification: ProjectClassification

  @IsEnum(GameEngine)
  @IsNotEmpty()
  kind: GameEngine

  // @IsEnum(ReleaseStatus)
  // releaseStatus: ReleaseStatus

  @Matches(/^[a-zA-Z0-9_-]+$/)
  @Length(1, 50)
  @IsString()
  @IsOptional()
  projectURL: string

  @IsEnum(PaymentMode)
  @IsNotEmpty()
  paymentMode: PaymentMode

  @IsString()
  @IsNotEmpty()
  description: string

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
  @IsOptional()
  appStoreLinks: string[]

  // Use localhost url, do not use Url verification
  @IsOptional()
  @IsString()
  cover: string

  // Use localhost url, do not use Url verification
  @IsOptional()
  @IsString({ each: true })
  screenshots: string[]

  @IsEnum(GameFileCharset)
  charset: GameFileCharset
}
