// load Playwrite module

import { test, expect, APIResponse } from '@playwright/test';
// write a test 

interface BookingDates {
  checkin: string;
  checkout: string;
}

interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

interface PostAPIResponseBody {
  booking: Booking;
}
// Create POST API request
test("Create POST API request using static request body in Playwright", async ({ request }) => {
  // Create POST API request using Playwright
  const postAPIResponse: APIResponse = await request.post('/booking', {
    data: {
      firstname: 'testers talk playwright',
      lastname: 'testers talk api testing',
      totalprice: 1000,
      depositpaid: true,
      bookingdates: {
        checkin: '2018-01-01',
        checkout: '2019-01-01',
      },
      additionalneeds: 'super bowls',
    },
  });

  // Validate status code
  const postAPIResponseBody: PostAPIResponseBody = await postAPIResponse.json();

  console.log(postAPIResponseBody);

  // Check if the response was OK and has the correct status
  expect(postAPIResponse.ok()).toBeTruthy();
  expect(postAPIResponse.status()).toBe(200);

  // Validate API response json object
  expect(postAPIResponseBody.booking).toHaveProperty(
    'firstname',
    'testers talk playwright'
  );
  expect(postAPIResponseBody.booking).toHaveProperty(
    'lastname',
    'testers talk api testing'
  );

  // Validate API response nested json object (bookingdates)
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    'checkin',
    '2018-01-01'
  );
  expect(postAPIResponseBody.booking.bookingdates).toHaveProperty(
    'checkout',
    '2019-01-01'
  );
});
