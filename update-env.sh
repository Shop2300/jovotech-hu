#!/bin/bash
# Update environment variables for better database performance

# First, backup your current .env file
cp .env .env.backup

# Update DATABASE_URL with connection pooling parameters
# This adds connection limiting and timeouts to prevent slow queries
echo "Updating DATABASE_URL with performance parameters..."

# Read the current DATABASE_URL
current_url=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2-)

# Check if parameters already exist
if [[ $current_url == *"connection_limit"* ]]; then
    echo "DATABASE_URL already has connection parameters"
else
    # Add connection parameters
    if [[ $current_url == *"?"* ]]; then
        # URL already has parameters, append with &
        new_url="${current_url}&connection_limit=10&pool_timeout=10&connect_timeout=10"
    else
        # No parameters yet, add with ?
        new_url="${current_url}?connection_limit=10&pool_timeout=10&connect_timeout=10"
    fi
    
    # Update the .env file
    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=${new_url}|" .env
    echo "DATABASE_URL updated successfully"
fi

# Also update Vercel environment variables
echo ""
echo "Don't forget to update the DATABASE_URL in Vercel dashboard with these parameters:"
echo "connection_limit=10&pool_timeout=10&connect_timeout=10"
echo ""
echo "Your optimized DATABASE_URL should end with:"
echo "?sslmode=require&connection_limit=10&pool_timeout=10&connect_timeout=10"