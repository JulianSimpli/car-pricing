import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

import { User } from '../user/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportService {
  constructor(@InjectRepository(Report) private reportRepository: Repository<Report>) { }

  create(createReportDto: CreateReportDto, user: User) {
    const report = this.reportRepository.create(createReportDto)
    report.user = user
    return this.reportRepository.save(report)
  }

  async approveReport(id: number, approved: boolean) {
    const report = await this.reportRepository.findOneBy({ id })
    if (!report) {
      throw new NotFoundException('report not found')
    }
    return this.reportRepository.save({ ...report, approved })
  }

  getEstimate(query: GetEstimateDto) {
    const { make, model, lat, lng, mileage, year } = query
    // find reports for the same model/make 
    // within +/- 5 degrees
    // within 3 years
    // order by closest 'x' mileage
    // get the first 3 and take the average price of them
    return this.reportRepository.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS NULL')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne()
  }
}
