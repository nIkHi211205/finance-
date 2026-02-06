import { useState, useEffect } from 'react';

const INITIAL_GROUPS = [
    { id: '1', name: 'Gold Plan A', value: 100000, members: 20, duration: 20, startDate: '2024-01-01', status: 'ACTIVE', membersList: [] },
    { id: '2', name: 'Silver Saver', value: 50000, members: 20, duration: 20, startDate: '2024-02-15', status: 'ACTIVE', membersList: [] },
];

export const useChits = () => {
    const [groups, setGroups] = useState(() => {
        const saved = localStorage.getItem('chit_groups');
        return saved ? JSON.parse(saved) : INITIAL_GROUPS;
    });

    useEffect(() => {
        localStorage.setItem('chit_groups', JSON.stringify(groups));
    }, [groups]);

    const addGroup = (group) => {
        const newGroup = {
            ...group,
            id: Date.now().toString(),
            status: 'PENDING', // Pending until start date
            membersCount: 0, // Current joined members
            membersList: []
        };
        setGroups([...groups, newGroup]);
    };

    const addMember = (groupId, member) => {
        setGroups(prevGroups => prevGroups.map(g => {
            if (g.id === groupId) {
                const updatedMembers = g.membersList ? [...g.membersList, member] : [member];
                return {
                    ...g,
                    membersList: updatedMembers,
                    membersCount: updatedMembers.length
                };
            }
            return g;
        }));
    };

    const getGroup = (id) => groups.find(g => g.id === id);

    return { groups, addGroup, addMember, getGroup };
};
