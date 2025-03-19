import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export async function isValid(id: string, model: any, errorText?: string) {
  if (id === undefined) return;

  if (!isValidObjectId(id)) {
    throw new BadRequestException(`Невалидный id ${errorText ?? ''}`);
  }

  const isExists = await model.exists({
    _id: id,
  });

  if (!isExists) {
    throw new BadRequestException(
      `${errorText ?? 'Элемента'} с таким id не существует`,
    );
  }

  return true;
}