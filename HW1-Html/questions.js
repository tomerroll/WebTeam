const questions = {
    'order-of-operations': [
        {
            question: '5 × (3 + 2) = ?',
            answers: ['25', '15', '20', '10'],
            correct: '25',
            explanation: 'קודם פותרים את הסוגריים (3 + 2 = 5), ואז מכפילים ב-5'
        },
        {
            question: '10 - 2 × 3 = ?',
            answers: ['4', '24', '8', '16'],
            correct: '4',
            explanation: 'קודם מכפילים (2 × 3 = 6), ואז מחסירים מ-10'
        },
        {
            question: '(4 + 2) × (3 + 1) = ?',
            answers: ['24', '16', '20', '12'],
            correct: '24',
            explanation: 'קודם פותרים את הסוגריים (4 + 2 = 6) ו-(3 + 1 = 4), ואז מכפילים'
        }
    ],
    'fractions': [
        {
            question: '1/2 + 1/4 = ?',
            answers: ['3/4', '2/6', '1/6', '2/4'],
            correct: '3/4',
            explanation: 'מביאים למכנה משותף 4, ואז מחברים את המונים'
        },
        {
            question: '2/3 × 3/4 = ?',
            answers: ['1/2', '6/12', '1/4', '3/6'],
            correct: '1/2',
            explanation: 'מכפילים מונה במונה ומכנה במכנה, ואז מצמצמים'
        }
    ],
    'equations': [
        {
            question: '2x + 3 = 7, x = ?',
            answers: ['2', '4', '1', '3'],
            correct: '2',
            explanation: 'מחסירים 3 משני האגפים ואז מחלקים ב-2'
        },
        {
            question: '3x - 6 = 9, x = ?',
            answers: ['5', '3', '4', '6'],
            correct: '5',
            explanation: 'מוסיפים 6 לשני האגפים ואז מחלקים ב-3'
        }
    ]
}; 