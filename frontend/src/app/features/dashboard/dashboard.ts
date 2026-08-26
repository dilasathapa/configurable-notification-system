import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  stats = [
    {
      label: 'Active Rules',
      value: 1,
      description: 'Currently enabled',
    },
    {
      label: 'Notifications',
      value: 4,
      description: 'Generated recently',
    },
    {
      label: 'Sent',
      value: 2,
      description: 'Successfully delivered',
    },
    {
      label: 'Failed',
      value: 0,
      description: 'Delivery failures',
    },
  ];

  recentNotifications = [
    {
      rule: 'High Value Orders',
      recipient: 'Sales Manager',
      channel: 'EMAIL',
      status: 'SENT',
      time: 'Just now',
    },
    {
      rule: 'High Value Orders',
      recipient: 'Sales Manager',
      channel: 'IN-APP',
      status: 'SENT',
      time: 'Just now',
    },
  ];
}