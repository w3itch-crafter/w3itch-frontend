import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator'
class ScreenshotDTO {
  @IsUrl()
  value: string
}

export class Game {
  @Length(1, 50)
  @IsString()
  @IsNotEmpty()
  title: string

  @Length(1, 120)
  @IsString()
  subtitle: string

  // @IsEnum(ProjectClassification)
  // @IsNotEmpty()
  // classification: ProjectClassification

  // @IsEnum(GameEngine)
  // @IsNotEmpty()
  // kind: GameEngine

  // @IsEnum(ReleaseStatus)
  // releaseStatus: ReleaseStatus

  // @IsEnum(PaymentMode)
  // @IsNotEmpty()
  // paymentMode: PaymentMode

  // @IsString()
  // @IsNotEmpty()
  // description: string

  // @IsEnum(Community)
  // @IsNotEmpty()
  // community: Community

  // @IsEnum(Genre)
  // @IsNotEmpty()
  // genre: Genre

  tags: string[]

  // @Length(1, 120)
  // @IsString({ each: true })
  // @IsEmpty()
  // appStoreLinks: string[]

  @Length(1, 120)
  appStoreLink: string

  // @IsInt()
  // tokenId: number

  @IsUrl()
  @IsNotEmpty()
  cover: string

  // @ValidateNested({ each: true })
  // @Type(() => ScreenshotDTO)
  @IsOptional()
  screenshots: ScreenshotDTO[]
}
