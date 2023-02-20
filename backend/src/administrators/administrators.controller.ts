import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdministratorsService } from './administrators.service';
import { GetAdministrator } from './decorators/get-administrator.decorator';
import { AdministratorCredentialsDto } from './dto/administrator-credentials.dto';
import { Administrator } from './entities/administrator.entity';
import { AdministratorJwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('administrators')
export class AdministratorsController {
  constructor(private authService: AdministratorsService) {}

  @Post('/signup')
  signUp(@Body() administratorCredentialsDto: AdministratorCredentialsDto): Promise<void> {
    return this.authService.signUp(administratorCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() administratorCredentialsDto: AdministratorCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(administratorCredentialsDto);
  }

  @Get('test')
  @UseGuards(AdministratorJwtAuthGuard)
  test(
    @GetAdministrator() administrator: Administrator,
  ) {
    console.log(administrator);
  }
}
