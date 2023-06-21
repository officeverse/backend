export class CreateUserDTO {
  firstName: string;
  lastName?: string;
  dateOfBirth: Date;
  jobTitle: string;
  dateJoined: Date;
  numMCSRemaining?: number;
  numLeavesRemaining?: number;
}
