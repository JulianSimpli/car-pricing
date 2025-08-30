import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateReportDto } from './dtos/create-report.dto';
import { ReportService } from './report.service';
import { Report } from './report.entity';

import { User } from '../user/user.entity';

describe('ReportService', () => {
  let reportService: ReportService;
  let fakeReportRepository: Partial<Repository<Report>>;

  // Test data helpers - reutilizables para otros tests
  const createMockUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    email: 'test@example.com',
    password: 'password',
    ...overrides,
  } as User);

  const createMockReport = (overrides: Partial<Report> = {}): Report => ({
    id: 1,
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    lng: -58.38,
    lat: -34.6,
    mileage: 50000,
    price: 15000,
    approved: false,
    user: createMockUser(),
    ...overrides,
  } as Report);

  const createMockCreateReportDto = (overrides: Partial<CreateReportDto> = {}): CreateReportDto => ({
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    lng: -58.38,
    lat: -34.6,
    mileage: 50000,
    price: 15000,
    ...overrides,
  } as CreateReportDto);

  // Mock repository helper
  const createMockRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
  });

  beforeEach(async () => {
    fakeReportRepository = createMockRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(Report),
          useValue: fakeReportRepository
        }
      ],
    }).compile();

    reportService = module.get<ReportService>(ReportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(reportService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new report', async () => {
      // Arrange
      const user = createMockUser();
      const createReportDto = createMockCreateReportDto();
      const mockReport = createMockReport({ user });

      (fakeReportRepository.create as jest.Mock).mockReturnValue(mockReport);
      (fakeReportRepository.save as jest.Mock).mockResolvedValue(mockReport);

      // Act
      const result = await reportService.create(createReportDto, user);

      // Assert
      expect(fakeReportRepository.create).toHaveBeenCalledWith(createReportDto);
      expect(fakeReportRepository.save).toHaveBeenCalledWith(mockReport);
      expect(result).toEqual(mockReport);
      expect(result.user).toBe(user);
    });

    it('should create report with different data', async () => {
      // Arrange
      const user = createMockUser({ id: 2 });
      const createReportDto = createMockCreateReportDto({
        make: 'Honda',
        model: 'Civic',
        price: 20000,
      });
      const mockReport = createMockReport({
        make: 'Honda',
        model: 'Civic',
        price: 20000,
        user
      });

      (fakeReportRepository.create as jest.Mock).mockReturnValue(mockReport);
      (fakeReportRepository.save as jest.Mock).mockResolvedValue(mockReport);

      // Act
      const result = await reportService.create(createReportDto, user);

      // Assert
      expect(fakeReportRepository.create).toHaveBeenCalledWith(createReportDto);
      expect(result.make).toBe('Honda');
      expect(result.price).toBe(20000);
    });
  });
});
