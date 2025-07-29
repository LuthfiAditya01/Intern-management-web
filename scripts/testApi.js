import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const BASE_URL = 'http://localhost:3001';

const testEndpoints = async () => {
    console.log('Testing API endpoints...\n');

    try {
        // Test GET /api/users
        console.log('1. Testing GET /api/users...');
        const usersResponse = await axios.get(`${BASE_URL}/api/users`);
        console.log('✅ Users API:', usersResponse.data.users?.length || 0, 'users found');
    } catch (error) {
        console.log('❌ Users API Error:', error.response?.data?.message || error.message);
    }

    try {
        // Test GET /api/intern
        console.log('\n2. Testing GET /api/intern...');
        const internResponse = await axios.get(`${BASE_URL}/api/intern`);
        console.log('✅ Intern API:', internResponse.data.interns?.length || 0, 'interns found');
    } catch (error) {
        console.log('❌ Intern API Error:', error.response?.data?.message || error.message);
    }

    try {
        // Test GET /api/mentor
        console.log('\n3. Testing GET /api/mentor...');
        const mentorResponse = await axios.get(`${BASE_URL}/api/mentor`);
        console.log('✅ Mentor API:', mentorResponse.data.mentors?.length || 0, 'mentors found');
    } catch (error) {
        console.log('❌ Mentor API Error:', error.response?.data?.message || error.message);
    }

    try {
        // Test GET /api/assessment
        console.log('\n4. Testing GET /api/assessment...');
        const assessmentResponse = await axios.get(`${BASE_URL}/api/assessment`);
        console.log('✅ Assessment API:', assessmentResponse.data.assessments?.length || 0, 'assessments found');
    } catch (error) {
        console.log('❌ Assessment API Error:', error.response?.data?.message || error.message);
    }

    try {
        // Test GET /api/quota
        console.log('\n5. Testing GET /api/quota...');
        const quotaResponse = await axios.get(`${BASE_URL}/api/quota`);
        console.log('✅ Quota API:', quotaResponse.data.quotas?.length || 0, 'quotas found');
    } catch (error) {
        console.log('❌ Quota API Error:', error.response?.data?.message || error.message);
    }

    try {
        // Test GET /api/status-kuota
        console.log('\n6. Testing GET /api/status-kuota...');
        const statusResponse = await axios.get(`${BASE_URL}/api/status-kuota`);
        console.log('✅ Status Quota API:', statusResponse.data);
    } catch (error) {
        console.log('❌ Status Quota API Error:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 API testing completed!');
};

testEndpoints().catch(console.error); 