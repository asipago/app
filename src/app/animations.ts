import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [style({ opacity: 0 })],
      { optional: true }
    ),
    query(
      ':leave',
      [style({ opacity: 1 }), animate('0.3s', style({ opacity: 0 }))],
      { optional: true }
    ),
    query(
      ':enter',
      [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))],
      { optional: true }
    )
  ])
]);

export const expandAnimation = trigger('expandAnimation', [
  transition(':enter', [
    query('* => void', [
      style({ transform: 'translateY(-100%)' }),
      stagger(70, [
        animate('1ms ease-out', style('*'))
      ])
    ])
  ]),
  transition('* => void', animate('300ms linear', style({
    transform: 'translateY(100%)'
  }))),
  /*state('*', style({transform: 'translateY(0)'})),
  transition('void => *', [
    style({
      transform: 'translateY(-100%)'
    }),
    animate('1ms linear')
  ]),
  transition('* => void', animate('1ms linear', style({
    transform: 'translateY(100%)'
  }))),*/
]);

export const enterRightAnimation = trigger('enterRightAnimation', [
  transition(':enter', [
    style({transform: 'translateX(100%)', opacity: 0}),
    animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
  ]),
  transition(':leave', [
    style({transform: 'translateX(0)', opacity: 1}),
    animate('500ms', style({transform: 'translateX(100%)', opacity: 0}))
  ])
]);

export const enterLeftAnimation = trigger('enterLeftAnimation', [
  transition(':enter', [
    style({transform: 'translateX(0)', opacity: 0}),
    animate('500ms', style({transform: 'translateX(100%)', opacity: 1}))
  ]),
  transition(':leave', [
    style({transform: 'translateX(100%)', opacity: 1}),
    animate('500ms', style({transform: 'translateX(0)', opacity: 0}))
  ])
]);

export const enterBottomAnimation = trigger('enterBottomAnimation', [
  transition(':enter', [
    style({transform: 'translateY(100%)', opacity: 0}),
    animate('500ms', style({transform: 'translateY(0)', opacity: 1}))
  ]),
  transition(':leave', [
    style({transform: 'translateY(0)', opacity: 1}),
    animate('500ms', style({transform: 'translateY(100%)', opacity: 0}))
  ])
]);

export const enterTopAnimation = trigger('enterTopAnimation', [
  transition(':enter', [
    style({transform: 'translateY(0)', opacity: 0}),
    animate('500ms', style({transform: 'translateY(100%)', opacity: 1}))
  ]),
  transition(':leave', [
    style({transform: 'translateY(100%)', opacity: 1}),
    animate('500ms', style({transform: 'translateY(0)', opacity: 0}))
  ])
]);

export const animateToTop = trigger('animateToTop', [
  state('*', style({transform: 'translateY(0)'})),
  transition('void => *', [
    style({
      transform: 'translateY(100%)'
    }),
    animate('300ms ease-out')
  ]),
  transition('* => void', animate('300ms linear', style({
    transform: 'translateY(-100%)'
  }))),
]);

export const animateToRight = trigger('animateToRight', [
  state('*', style({transform: 'translateX(0)'})),
  transition('void => *', [
    style({
      transform: 'translateX(-100%)'
    }),
    animate('300ms ease-out')
  ]),
  transition('* => void', animate('300ms linear', style({
    transform: 'translateX(100%)'
  }))),
]);

export const animateToBottom = trigger('animateToBottom', [
  state('*', style({transform: 'translateY(0)'})),
  transition('void => *', [
    style({
      transform: 'translateY(-100%)'
    }),
    animate('300ms ease-out')
  ]),
  transition('* => void', animate('300ms linear', style({
    transform: 'translateY(100%)'
  }))),
]);

export const animateToLeft = trigger('animateToLeft', [
  state('*', style({transform: 'translateX(0)'})),
  transition('void => *', [
    style({
      transform: 'translateX(100%)'
    }),
    animate('300ms ease-out')
  ]),
  transition('* => void', animate('300ms linear', style({
    transform: 'translateX(-100%)'
  }))),
]);

export const animateScrollButton = trigger('animateScrollButton', [
  state('*', style({transform: 'translateY(0)'})),
  transition('void => *', [
    style({
      opacity: 1,
      transform: 'translateY(-100%)'
    }),
    animate('300ms ease-out')
  ]),
  transition('* => void', [
    style({ transform: 'translateY(100%)' }),
    animate('0.3s', style({ opacity: 0 }))
  ]),
]);